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
    const id = req.locals.user;

    if (!req.body.datetime) {
      return res.status(400).send({
        message: "Invalid request on body",
      });
    }

    const lastTicket = await prisma.ticketing.findFirst({
      orderBy: { Nomor_TC: "desc" },
    });

    let newTicketNumber = "001";
    if (lastTicket) {
      const currentNumber = parseInt(lastTicket.Nomor_TC.slice(2));
      newTicketNumber = String(currentNumber + 1).padStart(3, "0");
    }

    await prisma.ticketing.create({
      data: {
        UUID_TC: uuidv4(),
        UUID_UA: id,
        DateTime_TC: req.body.datetime,
        Nomor_TC: newTicketNumber,
        isDone_TC: false,
        isCancelled_TC: false,
        isWaiting_TC: true,
      },
    });

    return res.status(200).json({
      message: "Ticket created",
    });
  } catch (e) {
    return res.status(500).json({ error: "An error occured" + e });
  }
};

exports.findAll = async (req, res) => {
  try {
    const responseDatas = await prisma.ticketing.findMany({
      orderBy: { Nomor_TC: "desc" },
    });

    return res.status(200).json(responseDatas);
  } catch (e) {
    return res.status(500).json({ error: "An error occured" + e });
  }
};

exports.cancel = async (req, res) => {
  try {
    const {uuid} = req.params;

    if (!uuid) {
      return res
        .status(400)
        .send({ message: "Missing ticket ID in request parameters" });
    }

    const updatedTicket = await prisma.ticketing.update({
      where: { id: uuid },
      data: {
        isWaiting_TC: false,
        isCancelled_TC: true,
      },
    });

    if (!updatedTicket) {
      return res.status(404).send({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket cancelled successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while cancelling the ticket" });
  }
};

exports.complete = async (req, res) => {
  try {
    const {uuid} = req.params;
    if (!uuid) {
      return res
        .status(400)
        .send({ message: "Missing ticket ID in request parameters" });
    }

    const updatedTicket = await prisma.ticketing.update({
      where: { id: uuid },
      data: {
        isDone_TC: true,
        isWaiting_TC: false,
        isCancelled_TC: false,
      },
    });

    if (!updatedTicket) {
      return res.status(404).send({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket completed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while completing the ticket" });
  }
};
