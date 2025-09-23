export default function DishPage({ params }: { params: { id: string } }) {
	return <div>Dish Page: {params.id}</div>
}
