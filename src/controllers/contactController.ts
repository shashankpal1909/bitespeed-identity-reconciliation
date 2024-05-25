import { Request, Response } from "express";

import { logger } from "../logger";
import contactService from "../services/contactService";

export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;
  try {
    const result = await contactService.identify(email, phoneNumber);
    logger.info(
      JSON.stringify({ request: { email, phoneNumber }, response: result })
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
