import Link from "next/link";

export default function UISidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
          <li>
            <Link href="/clients">Clients</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
