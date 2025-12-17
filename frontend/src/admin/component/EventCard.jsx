import React from 'react';
import { View, Text, Button } from 'react-native';
import tailwind from 'tailwind-rn';

const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <View style={tailwind('border p-4 mb-4')}>
      <Text style={tailwind('text-xl font-bold')}>{event.name}</Text>
      <Text>{event.date}</Text>
      <Text>{event.location}</Text>
      <Text>{`Rp${event.price}`}</Text>
      <Button title="Edit" onPress={() => onEdit(event)} />
      <Button title="Hapus" onPress={() => onDelete(event)} />
    </View>
  );
};

export default EventCard;
