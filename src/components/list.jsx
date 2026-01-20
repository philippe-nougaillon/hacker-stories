import * as React from 'react';
import { sortBy } from 'lodash';
import { Item } from './item';

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    DATE: (list) => sortBy(list, 'created_at').reverse(),
    COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
    POINT: (list) => sortBy(list, 'points').reverse(),
};

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isReverse: false,
    });

    const handleSort = (sortKey) => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({ sortKey, isReverse });
    }

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse()
        : sortFunction(list);

    return (
        <ul>
            <li>
                <span>
                    <button type="button" onClick={() => handleSort('TITLE')}>
                        Title
                    </button>
                </span>
                <span>
                    <button type="button" onClick={() => handleSort('AUTHOR')}>
                        Author
                    </button>
                </span>
                <span>
                    <button type="button" onClick={() => handleSort('DATE')}>
                        Date
                    </button>
                </span>
                <span>
                    <button type="button" onClick={() => handleSort('COMMENT')}>
                        Comments
                    </button>
                </span>
                <span>
                    <button type="button" onClick={() => handleSort('POINT')}>
                        Points
                    </button>
                </span>
            </li>
            <br></br>
            {sortedList.map((item) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </ul>
    );
};

export { List };
