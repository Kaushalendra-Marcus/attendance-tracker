"use server"

import User from "../model/user.model"
import { connectToDB } from "../mongoose"

export async function fetchUser(rollno: string) {
    try {
        await connectToDB()
        return await User.findOne({ rollno })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}