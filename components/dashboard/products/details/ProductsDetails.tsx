'use client';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { useRouter } from 'next/navigation';

import Image from 'next/image';

import useFormatDate from '@/hooks/FormatDate';

import { TypographyContent } from '@/components/ui/typography';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { useDiscount } from '@/hooks/discountServices';

export default function ProductsDetails({ product }: { product: ProductsDetails }) {
    const router = useRouter();

    const { formatDate } = useFormatDate();

    const {
        originalPrice,
        discountedPrice,
        activeDiscount,
        discountExpired,
    } = useDiscount(product.price, product.discount);

    return (
        <section className="container space-y-6">
            {/* Hero Section */}
            <div className="border-b bg-linear-to-r from-primary/5 via-background to-background px-4 rounded-lg">
                <div className="container py-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge
                                    variant={product.status === 'publish' ? 'default' : 'secondary'}
                                    className="text-xs px-3 py-1"
                                >
                                    {product.status === 'publish' ? '✓ Published' : '📝 Draft'}
                                </Badge>
                                <Badge
                                    variant={product.paymentType === 'free' ? 'outline' : 'default'}
                                    className="text-xs px-3 py-1"
                                >
                                    {product.paymentType === 'free' ? '🆓 Free' : '💰 Paid'}
                                </Badge>
                                {product.rating && (
                                    <Badge variant="outline" className="text-xs px-3 py-1">
                                        ⭐ {product.rating.toFixed(1)} ({product.ratingCount || 0})
                                    </Badge>
                                )}
                                {product.views && (
                                    <Badge variant="outline" className="text-xs px-3 py-1">
                                        👁️ {product.views} views
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                                {product.title}
                            </h1>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.push(`/dashboard/products/products/edit?id=${product.productsId}`)}
                                className="shadow-sm hover:shadow-md transition-shadow"
                            >
                                ✏️ Edit Product
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={() => router.push('/dashboard/products/products')}
                                className="shadow-sm hover:shadow-md transition-shadow"
                            >
                                ← Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Images and Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Thumbnail */}
                    <Card className="overflow-hidden border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 p-0">
                        <CardContent className="p-0">
                            <div className="relative w-full aspect-video bg-linear-to-br from-muted/50 to-muted">
                                {product.thumbnail ? (
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center space-y-2">
                                            <span className="text-6xl">🖼️</span>
                                            <p className="text-muted-foreground text-lg">No image available</p>
                                        </div>
                                    </div>
                                )}
                                {activeDiscount && (
                                    <div className="absolute top-4 right-4">
                                        <Badge
                                            variant="destructive"
                                            className="text-sm px-4 py-2 shadow-lg animate-pulse"
                                        >
                                            {activeDiscount.type === 'percentage'
                                                ? `-${activeDiscount.value}%`
                                                : `-Rp ${activeDiscount.value.toLocaleString('id-ID')}`}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    {product.images && product.images.length > 0 && (
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span>📸</span> Product Gallery
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {product.images.map((image, index) => (
                                        <div
                                            key={`${image}-${index}`}
                                            className="relative aspect-square rounded-lg overflow-hidden border-2 hover:border-primary transition-all duration-300 group cursor-pointer"
                                        >
                                            <Image
                                                src={image}
                                                alt={`Product image ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Description */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span>📄</span> Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="w-full">
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <div className="min-w-max">
                                        <TypographyContent html={product.description} />
                                    </div>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* FAQs */}
                    {product.faqs && (
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span>❓</span> Frequently Asked Questions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="w-full">
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <div className="min-w-max">
                                            <TypographyContent html={product.faqs} />
                                        </div>
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                    {/* Price and Stock */}
                    <Card className="shadow-lg border-2 border-primary/20 bg-linear-to-br from-primary/5 to-background">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span>💰</span> Pricing & Inventory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex justify-between items-center p-4 rounded-lg bg-background/50 border">
                                <span className="text-muted-foreground font-medium">Price</span>
                                <div className="flex flex-col items-end gap-1">
                                    {product.paymentType === 'free' ? (
                                        <span className="text-3xl font-bold text-green-600">Free</span>
                                    ) : activeDiscount ? (
                                        <>
                                            <span className="text-3xl font-bold text-primary">
                                                Rp {discountedPrice.toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-lg text-muted-foreground line-through">
                                                Rp {originalPrice.toLocaleString('id-ID')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-primary">
                                            Rp {originalPrice.toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-background/50 border">
                                    <div className="text-xs text-muted-foreground mb-1">Stock</div>
                                    <div className={`text-2xl font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-destructive'}`}>
                                        {product.stock}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">available</div>
                                </div>
                                <div className="p-4 rounded-lg bg-background/50 border">
                                    <div className="text-xs text-muted-foreground mb-1">Sold</div>
                                    <div className="text-2xl font-bold">{product.sold || 0}</div>
                                    <div className="text-xs text-muted-foreground mt-1">units</div>
                                </div>
                            </div>

                            {product.discount && (
                                <div className={`p-4 rounded-lg border ${discountExpired
                                    ? 'bg-muted/50 border-muted'
                                    : 'bg-destructive/10 border-destructive/20'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground font-medium">Discount</span>
                                        <div className="flex items-center gap-2">
                                            {discountExpired && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Expired
                                                </Badge>
                                            )}
                                            <span className={`font-bold text-lg ${discountExpired ? 'text-muted-foreground' : 'text-destructive'
                                                }`}>
                                                {product.discount.type === 'percentage'
                                                    ? `${product.discount.value}% OFF`
                                                    : `Rp ${product.discount.value.toLocaleString('id-ID')} OFF`}
                                            </span>
                                        </div>
                                    </div>
                                    {product.discount.until && (
                                        <p className={`text-xs mt-2 ${discountExpired ? 'text-muted-foreground' : 'text-muted-foreground'
                                            }`}>
                                            {discountExpired ? (
                                                <span className="line-through">Valid until: {product.discount.until}</span>
                                            ) : (
                                                `Valid until: ${product.discount.until}`
                                            )}
                                        </p>
                                    )}
                                </div>
                            )}

                            {product.download && (
                                <div className="pt-4 border-t">
                                    <a
                                        href={product.download}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                                    >
                                        <span>⬇️</span> Download Link
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category, Type and Frameworks */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span>🏷️</span> Categories & Frameworks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {product.category && product.category.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                                        Categories
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.category.map((cat, idx) => (
                                            <Badge
                                                key={`${cat.categoryId}-${idx}`}
                                                variant="secondary"
                                                className="px-3 py-1"
                                            >
                                                {cat.title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.type && product.type.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                                        Type
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.type.map((type, idx) => (
                                            <Badge
                                                key={`${type.typeId}-${idx}`}
                                                variant="outline"
                                                className="px-3 py-1"
                                            >
                                                {type.title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.frameworks && product.frameworks.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                                        Frameworks
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {product.frameworks.map((framework, idx) => (
                                            <Card
                                                key={`${framework.frameworkId}-${idx}`}
                                                className="flex flex-col items-center gap-2 py-4 px-4 hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                {framework.thumbnail && (
                                                    <div className="relative aspect-square w-6 overflow-hidden shrink-0">
                                                        <Image
                                                            src={framework.thumbnail}
                                                            alt={framework.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <span className="font-medium text-sm text-center">{framework.title}</span>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span>🏷️</span> Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => {
                                        const tagTitle = typeof tag === 'string' ? tag : tag.title;
                                        const tagKey = typeof tag === 'string' ? tag : (tag.tagsId || tag.title);
                                        return (
                                            <Badge
                                                key={`${tagKey}-${index}`}
                                                variant="outline"
                                                className="px-3 py-1 hover:bg-primary/10 hover:border-primary transition-colors"
                                            >
                                                #{tagTitle}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Author */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span>👤</span> Author
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                {product.author.picture ? (
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                                        <Image
                                            src={product.author.picture}
                                            alt={product.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                                        <span className="text-2xl font-bold text-primary">
                                            {product.author.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-lg truncate">{product.author.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{product.author.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span>ℹ️</span> Metadata
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 transition-colors">
                                    <span className="text-sm text-muted-foreground font-medium">Product ID</span>
                                    <span className="text-sm font-mono font-semibold">{product.productsId}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 transition-colors">
                                    <span className="text-sm text-muted-foreground font-medium">Created</span>
                                    <span className="text-sm font-medium">
                                        {product.created_at ? formatDate(product.created_at) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 transition-colors">
                                    <span className="text-sm text-muted-foreground font-medium">Updated</span>
                                    <span className="text-sm font-medium">
                                        {product.updated_at ? formatDate(product.updated_at) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}