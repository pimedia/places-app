import React, { useState } from "react";

import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState();
  const verifyPermissions = async () => {
    const result = await Camera.requestPermissionsAsync();

    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions.",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    setPickedImage(image.uri);
    props.onImageTaken(image.uri); 
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <Button
        title="Take Image"
        color={Colors.primary}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    marginBottom: 15
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
export default ImgPicker;
