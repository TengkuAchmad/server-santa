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

    if (!req.body.date || !req.body.time) {
      return res.status(400).send({
        message: "Invalid request on body",
      });
    }

    const existingTickets = await prisma.ticketing.findMany({
      where: {
        UUID_UA: id,
        isWaiting_TC: true,
      },
    });

    if (existingTickets.length > 0) {
      return res.status(409).json({
        error:
          "User already has an open ticket. Please wait for your turn or contact support for assistance.",
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
        Date_TC: req.body.date,
        Time_TC: req.body.time,
        Nomor_TC: newTicketNumber,
        isDone_TC: false,
        isCancelled_TC: false,
        isWaiting_TC: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Ticket created",
    });
  } catch (e) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const uuid = req.locals.user;

    const ticketData = await prisma.ticketing.findFirst({
      where: {
        UUID_UA: uuid,
        isWaiting_TC: true,
        isCancelled_TC: false,
        isDone_TC: false
      },
    });

    if (!ticketData) {
      const responseNull = {
        ticketNumber: "0",
        totalTickets: 0,
        remainingTickets: 0,
        remainingQueueMessage: `Tersisa 0 antrian`,
      };
      return res
        .status(200)
        .json(responseNull);
    }

    const totalTickets = await prisma.ticketing.count();

    const remainingTickets = await prisma.ticketing.count({
      where: {
        UUID_UA: uuid,
        isWaiting_TC: true,
      }
    });

    const response = {
      ticketNumber: ticketData.Nomor_TC,
      totalTickets: totalTickets,
      remainingTickets: remainingTickets,
      remainingQueueMessage: `Tersisa ${remainingTickets} antrian`,
    };

    return res.status(200).json(response);
  } catch (e) {
    console.error(e); // Log the error for debugging
    return res.status(500).json({ error: "An error occurred" });
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

exports.findInfo = async (req, res) => {
  try {
    const { uuid } = req.params;

    const responseDatas = await prisma.ticketing.findFirst({
      where: {
        UUID_UA: uuid,
        isWaiting_TC: true,
        isCancelled_TC: false,
        isDone_TC: false
      }
    });

    return res.status(200).json(responseDatas)

  }  catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
}

exports.findCancelled = async (req, res) => {
  try {
    const responseDatasCancelled = await prisma.ticketing.findMany();

    return res.status(200).json(responseDatasCancelled);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
}

exports.findWaiting = async (req, res) => {
  try {
    const responseDatas = await prisma.ticketing.findMany({
      where: {
        isWaiting_TC: true,
      },
      orderBy: { Nomor_TC: "desc" },
    });

    const waitingCount = await prisma.ticketing.count({
      where: {
        isWaiting_TC: true,
        isDone_TC: false,
        isCancelled_TC: false,
      },
    });

    const completedCount = await prisma.ticketing.count({
      where: {
        isWaiting_TC: false,
        isDone_TC: true,
        isCancelled_TC: false
      }
    });

    const response = {
      waitingTicket: responseDatas[0] || 0,
      waitingCount: waitingCount, 
      completedCount: completedCount
    };

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res
        .status(400)
        .send({ message: "Missing ticket ID in request parameters" });
    }

    const updatedTicket = await prisma.ticketing.updateMany({
      where: { UUID_UA: uuid, isDone_TC: false},
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
    const { uuid } = req.params;
    if (!uuid) {
      return res
        .status(400)
        .send({ message: "Missing ticket ID in request parameters" });
    }

    const updatedTicket = await prisma.ticketing.update({
      where: { UUID_TC: uuid },
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

exports.deleteAll = async (req, res) => {
  try {
    await prisma.ticketing.deleteMany({});

    return res
      .status(200)
      .json({ message: "Successfully deleted all tickets" });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the ticket" });
  }
};
