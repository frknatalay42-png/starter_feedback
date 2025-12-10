import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all hosts
 * Supports query parameter: name (partial match with case-insensitive search)
 */
export async function getAllHosts(filters = {}) {
  const { name } = filters;
  
  return await prisma.host.findMany({
    where: {
      ...(name && { 
        name: {
          contains: name
        }
      }),
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
      listings: true,
    },
  });
}

/**
 * Get host by ID
 */
export async function getHostById(id) {
  return await prisma.host.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
      listings: true,
    },
  });
}

/**
 * Create a new host
 * Returns error object if host with username already exists
 */
export async function createHost(hostData) {
  // Check if host with username already exists
  const existingHost = await prisma.host.findUnique({
    where: { username: hostData.username }
  });
  
  if (existingHost) {
    return { 
      error: true, 
      statusCode: 409, 
      message: 'Host with this username already exists' 
    };
  }
  
  return await prisma.host.create({
    data: hostData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
    },
  });
}

/**
 * Update a host by ID
 */
export async function updateHost(id, hostData) {
  try {
    return await prisma.host.update({
      where: { id },
      data: hostData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        aboutMe: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

/**
 * Delete a host by ID
 */
export async function deleteHost(id) {
  try {
    await prisma.host.delete({
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
