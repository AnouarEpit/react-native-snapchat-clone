import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavComponentProps {
  currentPage: number;
  onNavigate: (pageIndex: number) => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
    success: string;
  };
}

const BottomNavComponent: React.FC<BottomNavComponentProps> = ({
  currentPage,
  onNavigate,
  colors,
}) => {
  const navItems = [
    { icon: "chatbubbles", label: "Messages", index: 0 },
    { icon: "camera", label: "Caméra", index: 1 },
    { icon: "library", label: "Stories", index: 2 },
  ];

  return (
    <View style={styles.bottomNav}>
      <View
        style={[
          styles.navContainer,
          currentPage === 1
            ? {
                backgroundColor: "transparent",
                borderTopWidth: 0,
              }
            : {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                borderTopWidth: 0.5,
              },
        ]}
      >
        {navItems.map((item) => (
          <Pressable
            key={item.index}
            style={styles.navItem}
            onPress={() => onNavigate(item.index)}
          >
            <Ionicons
              name={item.icon as any}
              size={currentPage === item.index ? 26 : 22}
              color={
                currentPage === item.index
                  ? colors.accent
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.navLabel,
                {
                  color:
                    currentPage === item.index
                      ? colors.accent
                      : colors.textSecondary,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navContainer: {
    flexDirection: "row",
    height: 70,
    borderTopWidth: 0.5,
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});

export default BottomNavComponent;
