import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform
} from "react-native";
import RNDraftView from "react-native-draftjs-editor";

const ControlButton = ({ text, action, isActive }) => {
  return (
    <TouchableOpacity
      style={[
        styles.controlButtonContainer,
        isActive ? { backgroundColor: "gold" } : {}
      ]}
      onPress={action}
      >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const EditorToolBar = ({
  activeStyles,
  blockType,
  toggleStyle,
  toggleBlockType
}) => {
  return (
    <View style={styles.toolbarContainer}>
      <ControlButton
        text={"B"}
        isActive={activeStyles.includes("BOLD")}
        action={() => toggleStyle("BOLD")}
        />
      <ControlButton
        text={"I"}
        isActive={activeStyles.includes("ITALIC")}
        action={() => toggleStyle("ITALIC")}
        />
      <ControlButton
        text={"H"}
        isActive={blockType === "header-one"}
        action={() => toggleBlockType("header-one")}
        />
      <ControlButton
        text={"ul"}
        isActive={blockType === "unordered-list-item"}
        action={() => toggleBlockType("unordered-list-item")}
        />
      <ControlButton
        text={"ol"}
        isActive={blockType === "ordered-list-item"}
        action={() => toggleBlockType("ordered-list-item")}
        />
      <ControlButton
        text={"--"}
        isActive={activeStyles.includes("STRIKETHROUGH")}
        action={() => toggleStyle("STRIKETHROUGH")}
        />
    </View>
  );
};

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  }
};

const App = (props) => {
  const _draftRef = React.createRef();
  const [activeStyles, setActiveStyles] = useState([]);
  const [blockType, setActiveBlockType] = useState("unstyled");
  const [editorState, setEditorState] = useState("");
  const [isActive, setActive] = useState(false);

  const editorLoaded = () => {
    props.setEditor(_draftRef);
  };

  const toggleStyle = style => {
    _draftRef.current && _draftRef.current.setStyle(style);
  };

  const toggleBlockType = blockType => {
    _draftRef.current && _draftRef.current.setBlockType(blockType);
  };

  useEffect(() => {
    /**
    * Get the current editor state in HTML.
    * Usually keep it in the submit or next action to get output after user has typed.
    */
    if(_draftRef.current && _draftRef.current.getEditorState() === props.defaultValue && !isActive){
      setActive(true);
    }

    if(_draftRef.current && _draftRef.current.getEditorState()!== props.defaultValue && isActive){
      props.onChange();
    }
    setEditorState(_draftRef.current ? _draftRef.current.getEditorState() : "");
  }, [_draftRef]);

  return (
    <SafeAreaView style={styles.containerStyle} >
      <EditorToolBar
        activeStyles={activeStyles}
        blockType={blockType}
        toggleStyle={toggleStyle}
        toggleBlockType={toggleBlockType}
        />
      <RNDraftView
        defaultValue={props.defaultValue}
        onEditorReady={editorLoaded}
        style={{ flex: 1, width:'100%', minHeight:200 }}
        placeholder={props.placeholder}
        ref={_draftRef}
        onStyleChanged={setActiveStyles}
        onBlockTypeChanged={setActiveBlockType}
        styleMap={styleMap}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginTop: 36,
    borderColor:'gray',
    borderWidth: 2,
  },
  toolbarContainer: {
    height: 56,
    flexDirection: "row",
    backgroundColor: "silver",
    alignItems: "center",
    justifyContent: "space-around"
  },
  controlButtonContainer: {
    padding: 8,
    borderRadius: 2
  }
});

export default App;
