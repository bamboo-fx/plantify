import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantIdentification, UserPlant, WateringReminder } from '../types/plant';

interface PlantStore {
  // Plant identifications history
  identifications: PlantIdentification[];
  addIdentification: (identification: PlantIdentification) => void;
  removeIdentification: (id: string) => void;
  
  // User's plant collection
  userPlants: UserPlant[];
  addUserPlant: (plant: UserPlant) => void;
  updateUserPlant: (id: string, updates: Partial<UserPlant>) => void;
  removeUserPlant: (id: string) => void;
  
  // Watering reminders
  wateringReminders: WateringReminder[];
  addWateringReminder: (reminder: WateringReminder) => void;
  updateWateringReminder: (id: string, updates: Partial<WateringReminder>) => void;
  completeWatering: (plantId: string) => void;
  
  // App settings
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

export const usePlantStore = create<PlantStore>()(
  persist(
    (set, get) => ({
      identifications: [],
      userPlants: [],
      wateringReminders: [],
      notifications: true,
      
      addIdentification: (identification) =>
        set((state) => ({
          identifications: [identification, ...state.identifications].slice(0, 50), // Keep last 50
        })),
      
      removeIdentification: (id) =>
        set((state) => ({
          identifications: state.identifications.filter((item) => item.id !== id),
        })),
      
      addUserPlant: (plant) =>
        set((state) => ({
          userPlants: [...state.userPlants, plant],
        })),
      
      updateUserPlant: (id, updates) =>
        set((state) => ({
          userPlants: state.userPlants.map((plant) =>
            plant.id === id ? { ...plant, ...updates } : plant
          ),
        })),
      
      removeUserPlant: (id) =>
        set((state) => ({
          userPlants: state.userPlants.filter((plant) => plant.id !== id),
          wateringReminders: state.wateringReminders.filter((reminder) => reminder.plantId !== id),
        })),
      
      addWateringReminder: (reminder) =>
        set((state) => ({
          wateringReminders: [...state.wateringReminders, reminder],
        })),
      
      updateWateringReminder: (id, updates) =>
        set((state) => ({
          wateringReminders: state.wateringReminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          ),
        })),
      
      completeWatering: (plantId) =>
        set((state) => {
          const plant = state.userPlants.find((p) => p.id === plantId);
          const now = new Date();
          const nextWatering = new Date(now.getTime() + (plant?.wateringFrequency || 7) * 24 * 60 * 60 * 1000);
          
          return {
            userPlants: state.userPlants.map((p) =>
              p.id === plantId
                ? { ...p, lastWatered: now, nextWateringDue: nextWatering }
                : p
            ),
            wateringReminders: state.wateringReminders.map((reminder) =>
              reminder.plantId === plantId
                ? { ...reminder, completed: true, dueDate: nextWatering }
                : reminder
            ),
          };
        }),
      
      setNotifications: (enabled) =>
        set(() => ({ notifications: enabled })),
    }),
    {
      name: 'plant-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        identifications: state.identifications,
        userPlants: state.userPlants,
        wateringReminders: state.wateringReminders,
        notifications: state.notifications,
      }),
    }
  )
);