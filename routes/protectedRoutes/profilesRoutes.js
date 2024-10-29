const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const Usuario = require('../../models/tb_usuario');
const UsuarioMusico = require('../../models/tb_usuario_musico');
const UsuarioProdutor = require('../../models/tb_usuario_produtor');
const UsuarioAmanteMusica = require('../../models/tb_usuario_am');


const { findById } = require('../../models/mongo/picture');

router.get('/info', authenticateToken, async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const userType = user.flag_tipo_usuario;

        switch (userType) {
            case 1:
                const musician = await UsuarioMusico.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
                res.json({
                    user,
                    musician,
                })

                break;
            case 2:
                const am = await UsuarioAmanteMusica.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
                res.json({
                    user,
                    am,
                })
                break;
            case 3:
                const producer = await UsuarioProdutor.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });
                res.json({
                    user,
                    producer,
                })

                break;
            default:
                console.log('Tipo de usuário desconhecido');
        }


    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
});
router.put('/update_user', authenticateToken, async (req, res) => {
    try {
        const { musicalGenre, name } = req.body.user;
        const { comment } = req.body.userMusician;

        const user = await Usuario.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        user.NOME = name || user.NOME; // Atualiza se um novo nome for fornecido
        user.GENERO_MUSICAL = musicalGenre || user.GENERO_MUSICAL; // Atualiza se um novo gênero musical for fornecido
        user.NovoUsuario= true;
        await user.save();

        const musician = await UsuarioMusico.findOne({ where: { ID_USUARIO: user.ID_USUARIO } });

        if (!musician) {
            return res.status(404).json({ message: 'Músico não encontrado' });
        }

        // Atualiza os dados do músico
        musician.COMENTARIO = comment || musician.COMENTARIO; // Atualiza se um novo comentário for fornecido

        await musician.save(); // Salva as alterações no banco de dados.

        return res.json({ message: 'Dados atualizados com sucesso', user, musician });
    } catch (error) {
        console.error(error); // Adicione um log de erro para debugar
        res.status(500).json({ message: 'Erro ao atualizar os dados', error });
    }

});



module.exports = router;