// Utility functions for managing faculty profiles in localStorage

export interface FacultyProfile {
  fullName: string
  email: string
  phone: string
  designation: string
  department: string
  specialization: string
  experience: string
  qualification: string
  address: string
  dateOfJoining: string
  employeeId: string
  bio: string
  isSaved: boolean
  id: string
}

export const saveFacultyProfile = (profile: Omit<FacultyProfile, "id">) => {
  const id = `faculty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const profileWithId = { ...profile, id }
  localStorage.setItem(`faculty_${id}`, JSON.stringify(profileWithId))
  return profileWithId
}

export const getFacultyProfile = (id: string): FacultyProfile | null => {
  const profile = localStorage.getItem(`faculty_${id}`)
  return profile ? JSON.parse(profile) : null
}

export const getAllFacultyProfiles = (): FacultyProfile[] => {
  const profiles: FacultyProfile[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith("faculty_")) {
      try {
        const profile = JSON.parse(localStorage.getItem(key) || "{}")
        if (profile && profile.isSaved) {
          profiles.push(profile)
        }
      } catch (error) {
        console.error("Error parsing faculty profile:", error)
      }
    }
  }

  return profiles
}

export const updateFacultyProfile = (id: string, updates: Partial<FacultyProfile>) => {
  const existing = getFacultyProfile(id)
  if (existing) {
    const updated = { ...existing, ...updates }
    localStorage.setItem(`faculty_${id}`, JSON.stringify(updated))
    return updated
  }
  return null
}

export const deleteFacultyProfile = (id: string) => {
  localStorage.removeItem(`faculty_${id}`)
}
