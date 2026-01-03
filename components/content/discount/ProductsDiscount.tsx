"use client"

import { Card, CardTitle, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import Link from "next/link"

import Image from "next/image"

import { useDiscount } from "@/hooks/discountServices"

import { useEffect, useState, useCallback } from "react"

function ProductDiscountCard({ item }: { item: ProductsDiscountItem }) {
    const { originalPrice, discountedPrice, activeDiscount, hasActiveDiscount } = useDiscount(item.price, item.discount);

    return (
        <Link href={`/products/${item.productsId}`} className="group">
            <Card className="p-0 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50">
                {/* Image Container with Discount Badge */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Discount Badge Overlay */}
                    {hasActiveDiscount && activeDiscount && (
                        <div className="absolute top-3 left-3 z-10">
                            <Badge
                                variant="destructive"
                                className="text-sm font-bold px-3 py-1 shadow-lg"
                            >
                                {activeDiscount.type === "percentage"
                                    ? `-${activeDiscount.value}%`
                                    : `-Rp ${activeDiscount.value.toLocaleString('id-ID')}`
                                }
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className="pt-0 space-y-3">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                    </CardTitle>
                    {/* Frameworks */}
                    <div className="flex flex-wrap gap-2">
                        {
                            item.frameworks.slice(0, 3).map((framework: Productsframeworks, frameworkIdx: number) => {
                                return (
                                    <Badge
                                        key={frameworkIdx}
                                        variant="outline"
                                        className="text-xs px-2 py-1"
                                    >
                                        {framework.title}
                                    </Badge>
                                )
                            })
                        }
                        {item.frameworks.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs px-2 py-1"
                            >
                                +{item.frameworks.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-row items-end gap-2 mb-5">
                        {item.paymentType === 'free' ? (
                            <span className="text-2xl font-bold text-green-600">Free</span>
                        ) : hasActiveDiscount ? (
                            <>
                                <span className="text-2xl font-bold text-primary">
                                    Rp {discountedPrice.toLocaleString('id-ID')}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    Rp {originalPrice.toLocaleString('id-ID')}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-primary">
                                Rp {originalPrice.toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

function CountdownTimer({ endDate }: { endDate: string }) {
    const [mounted, setMounted] = useState(false);

    const calculateTimeLeft = useCallback(() => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const difference = end - now;

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                expired: true
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            expired: false
        };
    }, [endDate]);

    const [timeLeft, setTimeLeft] = useState(() => ({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    }));

    useEffect(() => {
        // Mark as mounted to avoid hydration mismatch (deferred)
        const mountTimeout = setTimeout(() => {
            setMounted(true);
        }, 0);

        // Function to update time left
        const updateTime = () => {
            setTimeLeft(calculateTimeLeft());
        };

        // Update immediately when component mounts (deferred to avoid lint warning)
        const immediateUpdate = setTimeout(updateTime, 0);

        // Update every second
        const interval = setInterval(updateTime, 1000);

        return () => {
            clearTimeout(mountTimeout);
            clearTimeout(immediateUpdate);
            clearInterval(interval);
        };
    }, [calculateTimeLeft]);

    // Show placeholder during SSR to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="text-sm font-medium text-muted-foreground">Ends in</h3>
                <div className="flex flex-row items-center gap-2 font-mono">
                    <span className="text-lg font-bold text-primary">
                        00:00:00
                    </span>
                </div>
            </div>
        );
    }

    if (timeLeft.expired) {
        return (
            <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <h3 className="text-sm font-medium text-destructive">Expired</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <h3 className="text-sm font-medium text-muted-foreground">Ends in</h3>
            <div className="flex flex-row items-center gap-2 font-mono">
                {timeLeft.days > 0 && (
                    <span className="text-lg font-bold text-primary">
                        {timeLeft.days}d
                    </span>
                )}
                <span className="text-lg font-bold text-primary">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>
            </div>
        </div>
    );
}

export default function ProductsDiscount({ productsDiscount }: { productsDiscount: ProductsDiscountResponse }) {
    const productsArray = Array.isArray(productsDiscount.data) ? productsDiscount.data : [];

    // Find the earliest discount end date
    const getEarliestEndDate = () => {
        const dates = productsArray
            .map(item => item.discount?.until)
            .filter((date): date is string => !!date)
            .map(date => new Date(date))
            .sort((a, b) => a.getTime() - b.getTime());

        return dates.length > 0 ? dates[0].toISOString() : null;
    };

    const earliestEndDate = getEarliestEndDate();

    return (
        <section className="py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    {/* Heading */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Limited Time Offers</h2>
                        <p className="text-muted-foreground text-lg">Grab these deals before they expire</p>
                    </div>

                    {/* Countdowns */}
                    {earliestEndDate ? (
                        <CountdownTimer endDate={earliestEndDate} />
                    ) : (
                        <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-muted border">
                            <h3 className="text-sm font-medium text-muted-foreground">No active discounts</h3>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        productsArray.map((item, idx) => (
                            <ProductDiscountCard key={idx} item={item} />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}