const List = ({ list, onRemoveItem }) => 
    <ul>
        <li style={{ display: 'flex' }}>
            <span style={{ width: '40%' }}>Title</span>
            <span style={{ width: '30%' }}>Author</span>
            <span style={{ width: '10%' }}>Comments</span>
            <span style={{ width: '10%' }}>Points</span>
            <span style={{ width: '10%' }}>Actions</span>
        </li>
        <br></br>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>

const Item = ({ item, onRemoveItem }) =>
    <li style={{ display: 'flex'}}>
        <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>{item.author}</span>
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

export { List };
