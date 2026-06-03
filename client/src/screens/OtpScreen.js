import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import Colors from '../constants/colors';
import { useOtp } from '../hooks/useOtp';

export default function OtpScreen({ navigation, route }) {
    const {
        otp,
        setOtp,
        loading,
        resending,
        employeeId,
        email,
        handleVerify,
        handleResend,
    } = useOtp(navigation, route);

    return (
        <View style={style.container}>
            <View style={style.firstView}>
                <Image
                    source={require('../../assets/otp.png')}
                    style={style.image}
                />
            </View>

            <View style={style.secondView}>
                <Text style={style.heading}>OTP Verification</Text>
                <Text style={style.subheading}>
                    OTP sent to <Text style={style.emailHighlight}>{email}</Text>
                </Text>
                {/* <View style={style.idBox}>
                    <Text style={style.idLabel}>Your Employee ID</Text>
                    <Text style={style.idValue}>{employeeId}</Text>
                    <Text style={style.idNote}>Save this — you'll need it to log in</Text>
                </View> */}

                <OtpInput
                    numberOfDigits={6}
                    focusColor={Colors.primary}
                    onTextChange={setOtp}
                    theme={{
                        containerStyle: style.otpContainer,
                        pinCodeContainerStyle: style.otpBox,
                        pinCodeTextStyle: style.otpText,
                    }}
                />

                <TouchableOpacity
                    style={style.button}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color='#fff' />
                        : <Text style={style.buttonText}>Verify OTP</Text>
                    }
                </TouchableOpacity>
            </View>

            <View style={style.thirdView}>
                <Text style={style.subheading}>
                    Didn't receive the OTP?{' '}
                    {resending
                        ? <ActivityIndicator size='small' color={Colors.primary} />
                        : <Text style={style.resend} onPress={handleResend}>Resend</Text>
                    }
                </Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'white'
    },
    image: {
        resizeMode: 'cover',
        width: 250,
        height: 250,
    },
    firstView: {
        flex: 1,
        maxHeight: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondView: {
        flex: 1,
        gap: 20,
        paddingHorizontal: 4,
    },
    heading: {
        fontSize: 32,
        fontWeight: '400',
    },
    subheading: {
        color: Colors.grey,
        fontSize: 16,
    },
    emailHighlight: {
        color: Colors.primary,
        fontWeight: '600',
    },
    idBox: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 4,
        padding: 12,
        gap: 2,
    },
    idLabel: {
        fontSize: 11,
        color: Colors.grey,
        letterSpacing: 0.5,
    },
    idValue: {
        fontSize: 22,
        fontWeight: '400',
        letterSpacing: 2,
        color: Colors.primary,
    },
    idNote: {
        fontSize: 12,
        color: Colors.grey,
        marginTop: 2,
    },
    otpContainer: {
        marginVertical: 8,
    },
    otpBox: {
        borderWidth: 1.5,
        borderColor: '#d3d3d3',
        borderRadius: 8,
    },
    otpText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111',
    },
    resend: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400',
    },
    thirdView: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});