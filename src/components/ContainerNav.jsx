import './ContainerNav.css'

/*
  Menu de navegação dentro do container principal.
  Ao clicar, apenas troca o conteúdo exibido — "container change",
  sem recarregar a página nem alterar a rota.
*/
export default function ContainerNav({ items, active, onChange }) {
  return (
    <nav className="cnav" aria-label="Seções do portal de integridade">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={'cnav__btn' + (item.id === active ? ' is-active' : '')}
          aria-current={item.id === active ? 'true' : undefined}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
