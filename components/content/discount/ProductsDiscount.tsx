"use client"

import { Card, CardTitle, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import Link from "next/link"

import Image from "next/image"

import { useDiscount } from "@/hooks/discountServices"

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

export default function ProductsDiscount({ productsDiscount }: { productsDiscount: ProductsDiscountResponse }) {
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
                    <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                        <h3 className="text-sm font-medium text-muted-foreground">Ends in</h3>
                        <p className="text-lg font-bold text-primary font-mono">
                            {productsDiscount.data.map((item) => item.discount.until)}
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        productsDiscount.data.map((item, idx) => (
                            <ProductDiscountCard key={idx} item={item} />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}