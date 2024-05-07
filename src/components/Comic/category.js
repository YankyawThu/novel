import styles from "@/styles/Category.module.css";
import Image from 'next/image';
import helper from '@/utils/helper'
import Books from '@/dummy/books.json';
import {useTranslations} from 'next-intl';
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";

export default function Category(props) {
    const t = useTranslations("Default");
    const { locale } = useRouter()

    let [selected, addToSelected] = useState([{name: 'All',value: 'All'}])
    const [genre, setGenre] = useState('all')
    const [area, setArea] = useState('all')
    const [status, setStatus] = useState('all')
    const [vip, setVip] = useState('all')

    const selectGenre = (item) => {
        let index = selected.findIndex(data => data && data.name && data.name == 'genre');
        if(index >= 0){
            deleteByIndex(index)
        }
        if(item == 'all'){
            setGenre('all')
        } else {
            setGenre(item._id)
            addToSelected([...selected, {name: 'genre', value:item.name}])
        }
    }

    const selectArea = (item) => {
        let index = selected.findIndex(data => data && data.name && data.name == 'area')
        if(index >= 0){
            deleteByIndex(index)
        }
        if(item == 'all'){
            setArea('all')
        } else {
            setArea(item._id)
            addToSelected([...selected, {name: 'area', value: item.name}])
        }
    }

    const selectStatus = (item) => {
        let index = selected.findIndex(data => data && data.name && data.name == 'status')
        if(index >= 0){
            deleteByIndex(index)
        }
        if(item == 'all'){
            setStatus('all')
        } else {
            setStatus(item._id)
            addToSelected([...selected, {name: 'status', value: item.name }])
        }
    }

    const selectVip = (item) => {
        let index = selected.findIndex(data => data && data.name && data.name == 'vip')
        if(index >= 0){
            deleteByIndex(index)
        }
        if(item == 'all'){
            setVip('all')
        } else {
            setVip(item._id)
            addToSelected([...selected, {name: 'vip', value: item.name }])
        }
    }

    useEffect(() => {
        let exist = helper.findByKeyword(selected, 'value', 'All');
        if(exist){
            if(genre != 'all' && area != 'all' && status != 'all' && vip != 'all'){
                let index = selected.findIndex(data => data && data.value && data.value == 'All')
                if(index >= 0){
                    deleteByIndex(index)
                }
            } else {
                // selected = selected.filter(data => data !== null);
            }
        } else {
            if(genre == 'all' || area == 'all' || status == 'all' || vip == 'all'){
                selected.unshift({name: 'All', value:'All'});
            }
        }

        props.updateSelectedFilters(genre, area, status, vip)
    }, [genre, area, status, vip, selected])

    const deleteByIndex = (index) => {
        let list = selected
        selected.splice(index, 1);
        list = list.filter(item => item != null)
        addToSelected(list)
    }

    const removeSelected = (item) => {
        let index = selected.findIndex(data => data && data.value && data.value == item.value)
        deleteByIndex(index)

        if(item.name == 'genre'){
            setGenre('all')
            let all = helper.findByKeyword(selected, 'name', 'All');
            if(!all){
                let list = selected
                list.unshift({name: 'All', value:'All'});
                addToSelected(list)
            }
        } else if(item.name == 'area'){
            setArea('all')
            let all = helper.findByKeyword(selected, 'name', 'All');
            if(!all){
                let list = selected
                list.unshift({name: 'All', value:'All'});
                addToSelected(list)
            }
        } else if(item.name == 'status'){
            setStatus('all')
            let all = helper.findByKeyword(selected, 'name', 'All');
            if(!all){
                let list = selected
                list.unshift({name: 'All', value:'All'});
                addToSelected(list)
            }
        } else {
            setVip('all')
            let all = helper.findByKeyword(selected, 'name', 'All');
            if(!all){
                let list = selected
                list.unshift({name: 'All', value:'All'});
                addToSelected(list)
            }
        }
    }

    const getLocaleName = (item) => {
        if(item.name === 'All') {
            return t('all')
        } else if(item.name ==='genre'){
            let genre = helper.findByKeyword(props.genreList, "name", item.value)
            return locale === 'en' ? genre.name : genre.namemm
        } else if(item.name === 'area'){
            return item.value
        } else if(item.name === 'status') {
            let status = helper.findByKeyword(props.statusList, "name", item.value)
            return t(status._id)
        } else {
            let vip = helper.findByKeyword(props.vipList, "name", item.value)
            return t(vip._id)
        }
    }

    return (
        <div className="px-0 md:px-3">
            <div className="grid grid-cols-5 md:grid-cols-12 ">
                <div className="col-span-1 md:col-span-2">
                    <p className={styles.selected + ' text-[11px] md:text-[16px] pt-1'}>
                        {t('selected')} : 
                    </p>
                </div>
                <div className="col-span-4 md:col-span-10">
                    <div className="ml-2 flex w-full items-center">
                        {
                            selected && selected.length > 0 && selected.map((item, index) => (
                                <button 
                                    className={`text-[11px] md:text-[14px] ${index > 0 ? ' ml-2 ' + styles.selectedCategory  : styles.selectedCategory }`}
                                    key={index}
                                    onClick={() => removeSelected(item)}
                                >
                                    {getLocaleName(item)}
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                        className="w-4 h-4 ml-1 md:ml-2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            ))
                        }
                        
                    </div>
                </div>
            </div>

            <hr className={styles.breakLine}/>
            {/* Start Genre */}
            {
                props.genreList && props.genreList.length > 0 &&
                <div 
                    className="grid grid-cols-6 md:grid-cols-12"
                >
                    <div className="col-span-1 md:col-span-2">
                        <p className={styles.selected + ' text-[11px] md:text-[16px]'}>
                            {t('type')} : 
                        </p>
                    </div>
                    <div className="col-span-5 md:col-span-10">
                        <div className="flex items-center w-full overflow-auto">
                            <button 
                                className={`text-[11px] md:text-[14px] ${genre === 'all' ? styles.selectedCategory : styles.categoryItem} `}
                                onClick={ () => selectGenre('all')}
                            >
                                {t('all')}
                            </button>
                            {   props.genreList?.map((filter, index) => {
                                    return (
                                        <button 
                                            className={`text-[11px] md:text-[14px] ${genre === filter._id ? styles.selectedCategory : styles.categoryItem} ml-2`}
                                            key={filter._id}
                                            onClick={ () => selectGenre(filter)}
                                        >
                                            { locale === 'en' ? filter.name : filter.namemm }
                                        </button>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </div>
            }
            {/* End Genre */}

            {/* Start Area */}
            {
                props.areaList && props.areaList.length > 0 &&
                <div 
                    className="grid grid-cols-6 md:grid-cols-12 mt-4"
                >
                    <div className="col-span-1 md:col-span-2">
                        <p className={styles.selected + ' text-[11px] md:text-[16px]'}>
                            {t('area')} : 
                        </p>
                    </div>
                    <div className="col-span-5 md:col-span-10">
                        <div className="flex items-center w-full overflow-auto">
                            <button 
                                className={`text-[11px] md:text-[14px] ${genre === 'all' ? styles.selectedCategory : styles.categoryItem} `}
                                onClick={ () => selectGenre('all')}
                            >
                                {t('all')}
                            </button>
                            {   props.areaList?.map((filter, index) => {
                                    return (
                                        <button 
                                            className={`text-[11px] md:text-[14px] ${area === filter._id ? styles.selectedCategory : styles.categoryItem} ml-2`}
                                            key={filter._id}
                                            onClick={ () => selectArea(filter)}
                                        >
                                            {filter.name}
                                        </button>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </div>
            }
            {/* End Area */}

            {/* Start Status */}
            {
                props.statusList && props.statusList.length > 0 &&
                <div 
                    className="grid grid-cols-6 md:grid-cols-12 mt-4"
                >
                    <div className="col-span-1 md:col-span-2">
                        <p className={styles.selected + ' text-[11px] md:text-[16px]'}>
                            {t('status')} : 
                        </p>
                    </div>
                    <div className="col-span-5 md:col-span-10">
                        <div className="flex items-center w-full overflow-auto">
                            <button 
                                className={`text-[11px] md:text-[14px] ${status === 'all' ? styles.selectedCategory : styles.categoryItem} `}
                                onClick={ () => selectStatus('all')}
                            >
                                {t('all')}
                            </button>
                            {   props.statusList?.map((filter, index) => {
                                    return (
                                        <button 
                                            className={`text-[11px] md:text-[14px] ${status === filter._id ? styles.selectedCategory : styles.categoryItem} ml-2`}
                                            key={filter._id}
                                            onClick={ () => selectStatus(filter)}
                                        >
                                            {t(filter._id)}
                                        </button>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </div>
            }
            {/* End Status */}


            {/* Start VIP */}
            {
                props.vipList && props.vipList.length > 0 &&
                <div 
                    className="grid grid-cols-6 md:grid-cols-12 mt-4"
                >
                    <div className="col-span-1 md:col-span-2">
                        <p className={styles.selected + ' text-[11px] md:text-[16px]'}>
                            {t('vip')} : 
                        </p>
                    </div>
                    <div className="col-span-5 md:col-span-10">
                        <div className="flex items-center w-full overflow-auto">
                            <button 
                                className={`text-[11px] md:text-[14px] ${vip === 'all' ? styles.selectedCategory : styles.categoryItem} `}
                                onClick={ () => selectVip('all')}
                            >
                                {t('all')}
                            </button>
                            {   props.vipList?.map((filter, index) => {
                                    return (
                                        <button 
                                            className={`text-[11px] md:text-[14px] ${vip === filter._id ? styles.selectedCategory : styles.categoryItem} ml-2`}
                                            key={filter._id}
                                            onClick={ () => selectVip(filter)}
                                        >
                                            {t(filter._id)}
                                        </button>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </div>
            }
            {/* End VIP */}
        </div>
    )
}