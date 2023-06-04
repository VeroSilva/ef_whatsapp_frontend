import Link from "next/link";

function HomePage() {
  return (
    <div>
      <h1>Página de inicio</h1>
      <p>Bienvenido al chat de Whatsapp de EF Perfumes</p>
      <Link href="./pages/login">Login</Link>
      <Link href="./pages/conversation">Chat</Link>
    </div>
  );
}

export default HomePage;