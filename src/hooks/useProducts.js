import { useAllProducts } from './hooks/useProducts';

function MyCustomComponent() {
  const { products, loading, error } = useAllProducts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

function GetBestSellers() {
  const { products, loading, error } = useAllProducts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const bestSellers = products.filter(product => product.bestseller);

  return (
    <div>
      {bestSellers.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}