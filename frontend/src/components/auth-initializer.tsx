"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { fetchCurrentUser } from "../store/auth.slice";

export const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return null;
};
