"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApiUrl } from "@/lib/api";

interface FavoriteState {
    favorites: string[]; // List of product IDs
    loading: boolean;
    fetchFavorites: (token: string) => Promise<void>;
    toggleFavorite: (productId: string, token: string) => Promise<void>;
    clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
    persist(
        (set, get) => ({
            favorites: [],
            loading: false,

            fetchFavorites: async (token: string) => {
                set({ loading: true });
                try {
                    const res = await fetch(`${getApiUrl()}/api/favorites/ids`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.ok) {
                        const ids = await res.json();
                        set({ favorites: ids, loading: false });
                    }
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                    set({ loading: false });
                }
            },

            toggleFavorite: async (productId: string, token: string) => {
                const current = get().favorites;
                const exists = current.includes(productId);

                // Optimistic update
                const next = exists
                    ? current.filter(id => id !== productId)
                    : [...current, productId];

                set({ favorites: next });

                try {
                    const res = await fetch(`${getApiUrl()}/api/favorites/toggle/${productId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!res.ok) {
                        // Revert on error
                        set({ favorites: current });
                    }
                } catch (error) {
                    console.error("Error toggling favorite:", error);
                    set({ favorites: current });
                }
            },

            clearFavorites: () => set({ favorites: [] }),
        }),
        {
            name: "favorite-storage",
        }
    )
);
