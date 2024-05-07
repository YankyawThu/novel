import Api from "@/services/api";
import helper from '@/utils/helper';

export const getHomeWidget = async () => {
    try {
        const result = await Api.puller(null,"/home-widgets", {c: 9})
	    const res = JSON.parse(helper.decrypt(result.data.data))
        return res;
    } catch (error) {
        console.log(error);
    }
};

export default (req, res) => {
    res.status(200).json(getHomeWidget());
};