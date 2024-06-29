// LIBRARY IMPORT
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

// CONSTANT IMPORT
const { JWT_SECRET } = process.env;

// ORM
const prisma = new PrismaClient();

// FUNCTION IMPORT
exports.create = async (req, res) => {
    try {
        if (!req.body.name || !req.body.role) {
            return res.status(400).send({
                message: "Invalid request on body",
            });
        }

        await prisma.medicPersonel.create({
            data: {
                UUID_MP: uuidv4(),
                Name_MP: req.body.name,
                Role_MP: req.body.role,
            }
        })

        return res.status(201).send({
            message: "Personel created successfully",
        })
    } catch (e) {
        return res.status(500).json({ error: "An error occured", e });
    }
}

exports.findAll = async (req, res) => {
    try {
        const personel = await prisma.medicPersonel.findMany();
        
        return res.status(200).json(personel)
    } catch (e) {
        return res.status(500).json({ error: "An error occured", e });
    }
}


exports.deleteOne = async (req, res) => {
    try {
        const { uuid } = req.params;
        
        await prisma.medicPersonel.delete({
            where: {
                UUID_MP: uuid,
            },
        });
        
        return res.json({ message: "Personel deleted successfully" });
    } catch (e) {
        return res.status(500).json({ error: "An error occured" + e });
    }
};


exports.deleteAll = async (req, res) => {
    try {
        await prisma.medicPersonel.deleteMany();
        
        return res
            .status(200)
            .json({ message: "All personel successfully deleted" });
    } catch (e) {
        return res.status(500).json({ error: "An error occured" + e });
    }
};

