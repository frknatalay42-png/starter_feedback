import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Haal alle properties op - ondersteunt filters (location, pricePerNight)
export async function getAllProperties(filters = {}) {
  const { location, pricePerNight } = filters;
  
  const where = {};
  
  // Location filter - partial match
  if (location) {
    where.location = {
      contains: location
    };
  }
  
  // Price filter - less than or equal to given price
  if (pricePerNight) {
    where.pricePerNight = {
      lte: parseFloat(pricePerNight)
    };
  }
  
  return await prisma.property.findMany({
    where,
    include: {
      reviews: true,
      bookings: true,
    },
  });
}

/**
 * Get property by ID
 */
export async function getPropertyById(id) {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      reviews: true,
      bookings: true,
    },
  });
}

/**
 * Create a new property
 */
export async function createProperty(propertyData) {
  return await prisma.property.create({
    data: {
      ...propertyData,
      pricePerNight: parseFloat(propertyData.pricePerNight),
      rating: propertyData.rating ? parseFloat(propertyData.rating) : 0,
    },
  });
}

/**
 * Update a property by ID
 */
export async function updateProperty(id, propertyData) {
  try {
    const updateData = { ...propertyData };
    if (updateData.pricePerNight) {
      updateData.pricePerNight = parseFloat(updateData.pricePerNight);
    }
    if (updateData.rating) {
      updateData.rating = parseFloat(updateData.rating);
    }
    
    return await prisma.property.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

/**
 * Delete a property by ID
 */
export async function deleteProperty(id) {
  try {
    await prisma.property.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
}
