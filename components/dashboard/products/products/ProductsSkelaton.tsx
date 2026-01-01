"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ProductsSkelaton() {
    const [viewMode, setViewMode] = useState<"card" | "table">("table");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedViewMode = localStorage.getItem("productsViewMode");
            if (savedViewMode === "card" || savedViewMode === "table") {
                setViewMode(savedViewMode);
            }
        }
    }, []);
    return (
        <section className="flex flex-col gap-6">
            {/* Header Section Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-6 border rounded-2xl">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-9 w-32" />
                    <div className="flex gap-2 items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>

            {/* Content Section Skeleton - Conditional based on viewMode */}
            {viewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden p-0 group">
                            <div className="relative w-full aspect-4/3 overflow-hidden">
                                <Skeleton className="w-full h-full" />
                                <div className="absolute top-2 right-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </div>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent className="space-y-4 pb-4 -mt-4">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 flex-1 rounded-md" />
                                    <Skeleton className="h-9 flex-1 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="border rounded-2xl border-border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                                <TableHead className="text-right">
                                    <Skeleton className="h-4 w-20 ml-auto" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(10)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-4">
                                        <Skeleton className="w-16 h-16 rounded-md" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-9 w-9 rounded-md" />
                                            <Skeleton className="h-9 w-9 rounded-md" />
                                            <Skeleton className="h-9 w-9 rounded-md" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination Section Skeleton */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10 rounded-md" />
                        ))}
                    </div>
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        </section>
    );
}

