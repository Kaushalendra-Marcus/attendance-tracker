"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserData = {
  name?:    string;
  rollNo?:  string;
  branch?:  string;
  year?:    string;
  college?: string;
  userId?:  string;  // MongoDB _id — prevents rollno clash
  setUser:   (data: Partial<Omit<UserData, "setUser" | "clearUser">>) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserData>({
  name: "", rollNo: "", branch: "", year: "", college: "", userId: "",
  setUser: () => {}, clearUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name,    setName]    = useState("");
  const [rollNo,  setRollNo]  = useState("");
  const [branch,  setBranch]  = useState("");
  const [year,    setYear]    = useState("");
  const [college, setCollege] = useState("");
  const [userId,  setUserId]  = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const p = JSON.parse(stored);
        if (p.name)    setName(p.name);
        if (p.rollNo)  setRollNo(p.rollNo);
        if (p.branch)  setBranch(p.branch);
        if (p.year)    setYear(p.year);
        if (p.college) setCollege(p.college);
        if (p.userId)  setUserId(p.userId);
      }
    } catch (_) {}
  }, []);

  const setUser = (data: Partial<Omit<UserData, "setUser" | "clearUser">>) => {
    const updated = {
      name:    data.name    !== undefined ? data.name    : name,
      rollNo:  data.rollNo  !== undefined ? data.rollNo  : rollNo,
      branch:  data.branch  !== undefined ? data.branch  : branch,
      year:    data.year    !== undefined ? data.year    : year,
      college: data.college !== undefined ? data.college : college,
      userId:  data.userId  !== undefined ? data.userId  : userId,
    };
    setName(updated.name    || "");
    setRollNo(updated.rollNo  || "");
    setBranch(updated.branch  || "");
    setYear(updated.year    || "");
    setCollege(updated.college || "");
    setUserId(updated.userId  || "");
    localStorage.setItem("userData", JSON.stringify(updated));
  };

  const clearUser = () => {
    setName(""); setRollNo(""); setBranch(""); setYear(""); setCollege(""); setUserId("");
    localStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider value={{ name, rollNo, branch, year, college, userId, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);