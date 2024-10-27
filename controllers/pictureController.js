const Picture = require('../models/mongo/picture');
const Usuario = require('../models/tb_usuario');
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');     
require('dotenv').config(); 


const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

const uploadToDropbox = async (localFilePath, dropboxPath) => {
    try {
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
        const dropboxFilePath = await uploadToDropbox(file.path, dropboxPath); // Agora retorna a URL compartilhada

        const picture = new Picture({
            name,
            src: dropboxFilePath, // Salva a URL compartilhada do Dropbox
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
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }

        // Cria um link compartilhado para o arquivo (ao invés de armazenar o link permanentemente)
        const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
            path: picture.src,
        });

        // Retorna a URL do link compartilhado ajustado para exibição direta
        const directImageUrl = sharedLinkResponse.result.url.replace('dl=0', 'raw=1');
        res.json({ url: directImageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a imagem' });
    }
};


// Função para deletar um arquivo do Dropbox
const deleteFromDropbox = async (filePath) => {
    try {
        const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
        await dropbox.filesDeleteV2({ path: filePath }); // O filePath deve ser o caminho relativo salvo no MongoDB
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

        // Verifica se o usuário já possui uma imagem
        const existingPicture = await Picture.findById(user.IMAGE);

        if (!file) {
            return res.status(400).json({ msg: "Nenhum arquivo foi enviado" });
        }

        let dropboxFilePath;
        const dropboxPath = `/uploads/${file.filename}`;

        // Se o usuário já tem uma imagem, remove o arquivo antigo
        if (existingPicture) {
            // Exclui o arquivo antigo do Dropbox
            await deleteFromDropbox(existingPicture.src);

            // Faz o upload do novo arquivo para o Dropbox
            dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

            // Atualiza a imagem no MongoDB
            existingPicture.name = name;
            existingPicture.src = dropboxPath; // Atualiza apenas o caminho do novo arquivo
            await existingPicture.save();
        } else {
            // Se não existir uma imagem, cria uma nova
            dropboxFilePath = await uploadToDropbox(file.path, dropboxPath);

            const newPicture = new Picture({
                name,
                src: dropboxPath,
            });
            await newPicture.save();
            user.IMAGE = newPicture._id.toString(); // Atualiza a referência da imagem
        }

        // Salva a referência da imagem no MySQL
        await user.save();

        // Remove o arquivo local após o upload
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

        // Remove o arquivo do sistema de arquivos (pode adicionar lógica para remover do Dropbox, se necessário)
        fs.unlinkSync(picture.src);

        await Picture.findByIdAndDelete(req.params.id);

        res.json({ message: "Imagem removida com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar imagem" });
    }
};
