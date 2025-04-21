import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'Camila' },
    { id: 2, name: 'Emanuel' },
  ];

  res.json(users);
};
