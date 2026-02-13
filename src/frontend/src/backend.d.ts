import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    text: string;
    author: Principal;
    timestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    email: string;
    registeredAt: Time;
}
export interface DataEntry {
    key: string;
    value: string;
    author: Principal;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMessages(): Promise<void>;
    getAllMessages(): Promise<Array<Message>>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRecentMessages(_count: bigint): Promise<Array<Message>>;
    getSystemStats(): Promise<{
        totalEntries: bigint;
        totalMessages: bigint;
        totalUsers: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listEntries(): Promise<Array<DataEntry>>;
    postMessage(text: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEntry(key: string, value: string): Promise<void>;
}
