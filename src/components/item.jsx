const Item = ({ item, onRemoveItem }) =>
    <li style={{ display: 'flex' }}>
        <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '20%' }}>{item.author}</span>
        <span style={{ width: '10%' }}>{item.created_at}</span>
        <span style={{ width: '10%' }}>{item.num_comments}</span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
            <button type='button' onClick={() => onRemoveItem(item)}>
                Dismiss
            </button>
        </span>
        <br></br>
        <br></br>
    </li>

export { Item };