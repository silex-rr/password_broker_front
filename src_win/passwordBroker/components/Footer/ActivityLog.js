import React, {useContext, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native-windows';
import GlobalContext from '../../../../src_shared/common/contexts/GlobalContext';
import tw from 'twrnc';
import ActivityLogMessage from './ActivityLogMessage';

const ActivityLog = () => {
    const {activityLog} = useContext(GlobalContext);
    const [showFull, setShowFull] = useState(false);
    const handleShowFull = () => {
        setShowFull(!showFull);
        console.log(showFull);
    };
    const lastMessage = activityLog.length
        ? activityLog[0]
        : {
              time: '-',
              body: '',
          };
    const messages = [<ActivityLogMessage key={`activityLogMessage_last`} message={lastMessage} />];
    if (showFull) {
        for (let i = 1; i < activityLog.length; i++) {
            messages.push(<ActivityLogMessage key={`activityLogMessage_${i}`} message={activityLog[i]} />);
        }
    }

    return (
        <View style={tw`flex flex-row `}>
            <View style={tw`flex flex-row`}>
                <Text>activity</Text>
                <TouchableOpacity onPress={handleShowFull}>
                    <Text style={tw`text-cyan-300`}>
                        {activityLog.length > 1 ? ' (' + (showFull ? 'less' : 'more') + ')' : ''}
                    </Text>
                </TouchableOpacity>
                <Text>:</Text>
            </View>
            <View style={tw`relative flex flex-1`}>
                <ScrollView style={tw`flex flex-col max-h-24 ${showFull ? 'absolute bottom-0' : 'absolute top-0'}`}>
                    {messages}
                </ScrollView>
            </View>
        </View>
    );
};

export default ActivityLog;
