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
    }
})

export default styles