import { create } from "zustand";

const useTournamentStore = create((set) => ({
  selectedTournament: null,
  setSelectedTournament: (tournament) => set({ selectedTournament: tournament }),
}));

export default useTournamentStore;
