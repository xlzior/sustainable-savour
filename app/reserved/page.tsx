import { store } from "@/lib/store";
import { cookies } from "next/headers";

import ReservationsList from "./ReservationsList";
import { Item } from "../types";

const getUserInfo = async (sessionId: string) => {
  // Retrieve session from memory
  const session = store.get(sessionId);
  return session;
};

export default async function Reservations() {
  const sessionId = cookies().get("sessionId")?.value;

  let reservations: Item[] = []

  if (sessionId) {
    const userInfo = await getUserInfo(sessionId)
    const userId = userInfo?.sub
    if (userId !== undefined) {
      reservations = await
      fetch(
        new URL(`/api/reservations/${userId}`, process.env.API_URL),
        { next: { revalidate: 0 } }
      )
      .then(res => res.json() ?? [])
      .catch(() => [])
    }
  }
  
  return (
    <ReservationsList reservations={reservations} />
  )
}
