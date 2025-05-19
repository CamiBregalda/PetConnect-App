import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://emanuel:IsCB8A63mZupGwDj@cluster0.s8ucqow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado ao MongoDB com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
};
