import { create } from "zustand";

const useTournamentStore = create((set) => ({
  selectedTournament: null,
  setTournament: (tournament) => set({ selectedTournament: tournament }),
}));

export default useTournamentStore;
