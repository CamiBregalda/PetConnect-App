export const validateImage = (image?: Express.Multer.File) => {
    if (!image) {
        throw new Error('Por favor, selecione uma imagem!');
    } else if (!image.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        throw new Error('Somente arquivos JPG, JPEG e PNG são permitidos!');
    } else if (image.size > 5000000) {
        throw new Error('Por favor, selecione uma imagem com menos de 5MB!');
    }
};