
import { mixinLog } from '@/utils';

function pluginLog( Vue, options ){
	Vue.mixin( mixinLog );
}

export default pluginLog;