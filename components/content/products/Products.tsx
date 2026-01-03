"use client"

export default function Products({ products }: { products: Products[] }) {
    const productsArray = Array.isArray(products) ? products : [];

    return (
        <section className="container space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    productsArray.map((item, idx) => {
                        return (
                            <div key={idx}>
                                <h2>{item.title}</h2>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}
