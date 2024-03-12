import React, { useState, useEffect } from 'react';
import './GroupsList.css';
import groupsData from '../../groups.json';

const GroupsList = () => {

    const [groups, setGroups] = useState(groupsData);
    const [selectedGroup, setSelectedGroup] = useState();
    const [privacyFilter, setPrivacyFilter] = useState('all');
    const [avatarColorFilter, setAvatarColorFilter] = useState('any');
    const [friendsFilter, setFriendsFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    console.log(avatarColorFilter)
    const fetchData = async () => {
        try {
            if (groupsData.length > 0) {
                console.log(groupsData);
            } else {
                console.error('Произошла ошибка или результат равен 0');
            }
        } catch (error) {
            console.error('Произошла ошибка при выполнении запроса', error);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData();
            setLoading(false);
            setGroups(groupsData);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div>
            {loading ? (
                <p>Идет загрузка...</p>
            ) : (
                <div className='groups'>
                    <div className='groups__filters'>
                        <div>
                            <label>Тип приватности:</label>
                            <select
                                value={privacyFilter}
                                onChange={(e) => setPrivacyFilter(e.target.value)}
                            >
                                <option value='all'>Все</option>
                                <option value='open'>Открытые</option>
                                <option value='closed'>Закрытые</option>
                            </select>
                        </div>
                        <div>
                            <label>Цвет аватарки:</label>
                            <select
                                value={avatarColorFilter}
                                onChange={(e) => setAvatarColorFilter(e.target.value)}
                            >
                                <option value='any'>Любой</option>
                                <option value=''>Нет цвета</option>
                                {Array.from(
                                    new Set(groupsData.map((group) => group.avatar_color).filter(Boolean))
                                ).map((color) => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Наличие друзей:</label>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={friendsFilter}
                                    onChange={(e) => setFriendsFilter(e.target.checked)}
                                />
                                Только с друзьями
                            </label>
                        </div>
                    </div>
                    <div className='groups__group'>
                        {groups
                            .filter((group) => {
                                if (privacyFilter === 'open') {
                                    return group.closed === false;
                                } else if (privacyFilter === 'closed') {
                                    return group.closed === true;
                                }
                                return true;
                            })
                            .filter((group) => {
                                if (avatarColorFilter === 'any') {
                                    return true;
                                }
                                if (avatarColorFilter === '') {
                                    return !group.avatar_color
                                }
                                else {
                                    return group.avatar_color === avatarColorFilter;
                                }
                            })
                            .filter((group) => {
                                if (friendsFilter) {
                                    return group.friends && group.friends.length > 0;
                                }
                                return true;
                            })
                            .map((group) => (
                                <div key={group.id} className='group'>
                                    <h2>{group.name}</h2>
                                    {group.avatar_color && (
                                        <div
                                            className='group__avatar'
                                            style={{ backgroundColor: group.avatar_color }}
                                        />
                                    )}
                                    <p>{group.closed ? 'Закрытая' : 'Открытая'}</p>
                                    <p>Подписчики: {group.members_count}</p>
                                    {group.friends && (
                                        <div>
                                            <p
                                                onClick={() => {
                                                    if (selectedGroup === group.id) {
                                                        setSelectedGroup();
                                                    } else {
                                                        setSelectedGroup(group.id);
                                                    }
                                                }}
                                            >
                                                Друзья: {group.friends.length}
                                            </p>
                                            {selectedGroup === group.id && (
                                                <ul>
                                                    {group.friends.map((friend, index) => (
                                                        <li key={index}>
                                                            {friend.first_name} {friend.last_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default GroupsList;