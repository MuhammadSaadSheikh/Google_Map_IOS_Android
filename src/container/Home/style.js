import { StyleSheet } from 'react-native'

//utils
import { Metrics } from '../../utils'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // backgroundColor: 'green'
    },
    mapContainer: {
        flex: 1,
        width: Metrics.width,
        height: Metrics.height
    },
    bottomTab: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 20,
        backgroundColor: '#1233',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    timeContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default styles