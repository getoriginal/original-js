import {Base} from "./base";
import {Users} from "./user";

class Original extends Base{}
interface Original extends Users{}

applyMixins(Original, [Users]);

export default Original;