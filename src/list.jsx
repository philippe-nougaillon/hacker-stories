const List = ({ list, onRemoveItem }) =>
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>

const Item = ({ item, onRemoveItem }) =>
    <>
        <li>
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            <br></br>
            <span>{item.author}</span>
            <span>
                <button type='button' onClick={() => onRemoveItem(item)}>
                    Dismiss
                </button>
            </span>
            <br></br>
            <br></br>
        </li>
    </>  

export { List };
