const Picture = require('../models/mongo/picture');
const Usuario = require('../models/tb_usuario');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');
const { checkAndRefreshToken } = require('../config/dropboxconfig'); // Importe a função de verificação
require('dotenv').config();

// Função para obter o cliente do Dropbox com o token atualizado
const getDropboxClient = async () => {
    await checkAndRefreshToken(); // Verifica e atualiza o token, se necessário
    return new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
};

// Função para fazer upload para o Dropbox
const uploadToDropbox = async (localFilePath, dropboxPath) => {
    try {
        const dbx = await getDropboxClient(); // Obtenha o cliente do Dropbox com o token atualizado
        const fileContent = fs.readFileSync(localFilePath); // Lê o conteúdo do arquivo

        // Faz o upload para o Dropbox
        const uploadResponse = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
        });

        console.log('Arquivo enviado para o Dropbox:', uploadResponse);

        // Retorna apenas o caminho relativo no Dropbox
        return uploadResponse.result.path_display;
    } catch (error) {
        console.error('Erro ao enviar para o Dropbox:', error);
        throw error;
    }
};

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (!file) {
            return res.status(400).json({ msg: "Nenhum arquivo foi enviado" });
        }

        // Upload para o Dropbox
        const dropboxPath = `/uploads/${file.filename}`;
        const dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

        const picture = new Picture({
            name,
            src: dropboxFilePath, // Salva a URL do Dropbox
        });
        await picture.save();

        user.IMAGE = picture._id.toString(); // Salvar como string no MySQL
        await user.save();

        // Remove o arquivo local após o upload
        fs.unlinkSync(file.path);

        res.json({ picture, msg: "Imagem salva com sucesso" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao salvar a imagem", error });
    }
};

exports.getImage = async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            console.error('Imagem não encontrada para o ID:', req.params.id);
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }

        const dbx = await getDropboxClient();

        // Verifica se já existe um link de compartilhamento para o arquivo
        let sharedLinkResponse;
        try {
            sharedLinkResponse = await dbx.sharingListSharedLinks({
                path: picture.src,
                direct_only: true // Somente links diretos
            });

            // Se um link já existe, utiliza-o
            if (sharedLinkResponse.result.links.length > 0) {
                sharedLinkResponse = { result: sharedLinkResponse.result.links[0] };
            } else {
                // Cria um novo link de compartilhamento se não existir
                sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
                    path: picture.src,
                });
            }
        } catch (error) {
            console.error('Erro ao listar/criar link de compartilhamento:', error);
            return res.status(500).json({ error: 'Erro ao criar link de compartilhamento' });
        }

        const directImageUrl = sharedLinkResponse.result.url.replace('dl=0', 'raw=1');
        res.json({ url: directImageUrl });
    } catch (error) {
        console.error('Erro ao buscar a imagem:', error);
        res.status(500).json({ error: 'Erro ao buscar a imagem' });
    }
};


// Função para deletar um arquivo do Dropbox
const deleteFromDropbox = async (filePath) => {
    try {
        const dbx = await getDropboxClient(); // Obtenha o cliente do Dropbox com o token atualizado
        await dbx.filesDeleteV2({ path: filePath });
    } catch (error) {
        console.error("Erro ao deletar a imagem do Dropbox:", error);
        throw new Error("Não foi possível deletar a imagem antiga do Dropbox.");
    }
};

exports.updateImage = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const existingPicture = await Picture.findById(user.IMAGE);

        if (!file) {
            return res.status(400).json({ msg: "Nenhum arquivo foi enviado" });
        }

        let dropboxFilePath;
        const dropboxPath = `/uploads/${file.filename}`;

        if (existingPicture) {
            await deleteFromDropbox(existingPicture.src);
            dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

            existingPicture.name = name;
            existingPicture.src = dropboxFilePath; // Atualiza apenas o caminho do novo arquivo
            await existingPicture.save();
        } else {
            dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

            const newPicture = new Picture({
                name,
                src: dropboxFilePath,
            });
            await newPicture.save();
            user.IMAGE = newPicture._id.toString(); // Atualiza a referência da imagem
        }

        await user.save();

        fs.unlinkSync(file.path);

        res.json({ picture: existingPicture || newPicture, msg: "Imagem atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao atualizar a imagem", error });
    }
};

exports.remove = async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        // Remove o arquivo do sistema de arquivos
        await deleteFromDropbox(picture.src); // Deleta do Dropbox também
        await Picture.findByIdAndDelete(req.params.id);

        res.json({ message: "Imagem removida com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar imagem" });
    }
};
