const Post = require('../models/mongo/Post');
const { Dropbox } = require('dropbox');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg'); // Importa o ffmpeg
const path = require('path'); // Importa o path
const { checkAndRefreshToken } = require('../config/dropboxconfig'); // Importa a função de verificação de token
require('dotenv').config();

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

const uploadToDropbox = async (fileBuffer, dropboxPath) => {
    try {
        await checkAndRefreshToken(); // Verifica e atualiza o token antes de enviar
        dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN }); // Atualiza a instância do Dropbox com o token mais recente

        const uploadResponse = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileBuffer,
        });
        return uploadResponse.result.path_display;
    } catch (error) {
        console.error('Erro ao enviar para o Dropbox:', error);
        throw error;
    }
};

const mongoose = require('mongoose');

function compressVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264') // Codec de vídeo
            .audioCodec('aac') // Codec de áudio
            .on('stderr', (stderr) => {
                console.log('stderr:', stderr); // Captura os logs de erro do ffmpeg
            })
            .on('end', () => {
                console.log('Compressão concluída');
                resolve();
            })
            .on('error', (err) => {
                console.error('Erro ao compactar o vídeo:', err);
                reject(err);
            })
            .run();
    });
}

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const videoFile = req.files && req.files.video ? req.files.video[0] : null;
        const imageFile = req.files && req.files.image ? req.files.image[0] : null;

        let videoPath = null;
        let imagePath = null;

        // Criar diretório de uploads se não existir
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        if (videoFile) {
            const tempFilePath = path.join(uploadDir, videoFile.originalname);
            const compressedFilePath = path.join(uploadDir, `compressed_${videoFile.originalname}`);

            // Salvar o arquivo temporariamente e compactar
            try {
                fs.writeFileSync(tempFilePath, videoFile.buffer);
            } catch (err) {
                console.error('Erro ao salvar o arquivo temporário:', err);
                return res.status(500).json({ error: 'Erro ao salvar o vídeo temporário' });
            }

            await compressVideo(tempFilePath, compressedFilePath);

            // Ler o arquivo compactado como buffer para enviar ao Dropbox
            const compressedBuffer = fs.readFileSync(compressedFilePath);
            const dropboxVideoPath = `/posts/videos/${videoFile.originalname}`;
            videoPath = await uploadToDropbox(compressedBuffer, dropboxVideoPath);

            // Remover os arquivos temporários após o upload
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(compressedFilePath);
        }

        if (imageFile) {
            const dropboxImagePath = `/posts/images/${imageFile.originalname}`;
            imagePath = await uploadToDropbox(imageFile.buffer, dropboxImagePath);
        }

        const post = new Post({
            title,
            description,
            videoUrl: videoPath || "",
            imageUrl: imagePath || "",
            userId,
        });
        await post.save();

        res.json({ post, message: 'Postagem criada com sucesso!' });
    } catch (error) {
        console.error("Erro ao criar a postagem:", error);
        res.status(500).json({ error: 'Erro ao criar a postagem', details: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada' });
        }

        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: 'Ação de curtida atualizada', post });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao curtir a postagem', details: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Postagem não encontrada' });
        }

        post.comments.push({
            userId: req.user.id,
            comment,
        });

        await post.save();
        res.json({ message: 'Comentário adicionado', post });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar comentário', details: error.message });
    }
};
