import { Contact } from "../models/contact";
import prisma from "../utils/db";

interface IdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

const identify = async (
  email?: string,
  phoneNumber?: string
): Promise<IdentifyResponse> => {
  // Find contacts by email or phone number
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (contacts.length === 0) {
    // No existing contacts, create a new primary contact
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });
    return formatResponse(newContact);
  }

  // Find primary contacts with the same email or phone number
  const primaryContacts = await prisma.contact.findMany({
    where: {
      OR: [
        {
          email: {
            in: contacts
              .map((contact) => contact.email!)
              .filter((email): email is string => email !== null),
          },
        },
        {
          phoneNumber: {
            in: contacts
              .map((contact) => contact.phoneNumber!)
              .filter(
                (phoneNumber): phoneNumber is string => phoneNumber !== null
              ),
          },
        },
      ],
      linkPrecedence: "primary",
    },
  });

  // Choose the primary contact
  let primaryContact = primaryContacts[0];

  // Find secondary contacts with the same email or phone number
  const secondaryContacts = await prisma.contact.findMany({
    where: {
      OR: [
        {
          email: {
            in: contacts
              .map((contact) => contact.email!)
              .filter((email): email is string => email !== null),
          },
        },
        {
          phoneNumber: {
            in: contacts
              .map((contact) => contact.phoneNumber!)
              .filter(
                (phoneNumber): phoneNumber is string => phoneNumber !== null
              ),
          },
        },
      ],
      linkPrecedence: "secondary",
    },
  });

  // Handle merging of primary contacts if both email and phone number match different primary contacts
  const primaryContactFromEmail = primaryContacts.find(
    (contact) => contact.email === email
  );
  const primaryContactFromPhone = primaryContacts.find(
    (contact) => contact.phoneNumber === phoneNumber
  );

  if (
    primaryContactFromEmail &&
    primaryContactFromPhone &&
    primaryContactFromEmail.id !== primaryContactFromPhone.id
  ) {
    // Determine which primary contact is older
    primaryContact =
      primaryContactFromEmail.createdAt < primaryContactFromPhone.createdAt
        ? primaryContactFromEmail
        : primaryContactFromPhone;

    // Update the newer primary contact to be secondary
    await prisma.contact.update({
      where: {
        id:
          primaryContactFromEmail.id === primaryContact.id
            ? primaryContactFromPhone.id
            : primaryContactFromEmail.id,
      },
      data: {
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      },
    });

    // Re-fetch the updated contacts
    const updatedContacts = await prisma.contact.findMany({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    primaryContact =
      updatedContacts.find((contact) => contact.linkPrecedence === "primary") ||
      updatedContacts[0];
    secondaryContacts.splice(
      0,
      secondaryContacts.length,
      ...updatedContacts.filter((contact) => contact.id !== primaryContact.id)
    );
  }

  // Handle new contact info not already associated with existing contacts
  if (
    (email && !contacts.some((contact) => contact.email === email)) ||
    (phoneNumber &&
      !contacts.some((contact) => contact.phoneNumber === phoneNumber))
  ) {
    const newSecondaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      },
    });
    secondaryContacts.push(newSecondaryContact);
  }

  return formatResponse(primaryContact, secondaryContacts);
};

// Helper function to format the response
const formatResponse = (
  primaryContact: Contact,
  secondaryContacts: Contact[] = []
): IdentifyResponse => {
  const emails = Array.from(
    new Set(
      [
        primaryContact.email,
        ...secondaryContacts.map((contact) => contact.email),
      ].filter((email): email is string => email !== null)
    )
  );
  const phoneNumbers = Array.from(
    new Set(
      [
        primaryContact.phoneNumber,
        ...secondaryContacts.map((contact) => contact.phoneNumber),
      ].filter((phoneNumber): phoneNumber is string => phoneNumber !== null)
    )
  );
  const secondaryContactIds = secondaryContacts.map((contact) => contact.id);

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
};

export default { identify };
