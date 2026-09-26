import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { WatchlistStatus } from "@prisma/client";

type AddToWatchlistBody = {
  movieId: string;
  status?: WatchlistStatus;
  rating?: number;
  notes?: string;
};

const addToWatchlist = async (
  req: Request<{}, {}, AddToWatchlistBody>,
  res: Response,
) => {
  const { movieId, status, rating, notes } = req.body;
  const userId = "b9b04b4e-2a51-473b-a987-35bfbc9195cc";

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const existingMovie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!existingMovie) {
    return res.status(404).json({
      error: "Movie not found",
    });
  }

  const existingWatchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });

  if (existingWatchlistItem) {
    return res.status(400).json({
      error: "Movie already added to watchlist",
    });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      status: status ?? "PLANNED",
      rating,
      notes,
    },
  });

  return res.status(201).json(watchlistItem);
};

export { addToWatchlist };
