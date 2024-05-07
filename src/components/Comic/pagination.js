import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import styles from "@/styles/Comic.module.css";

export default function PaginationList(){
    return (
        <div className={'flex justify-center mb-10'}>
            <Stack spacing={2}>
                <Pagination count={10} color="primary" />
            </Stack>
        </div>
    )
}