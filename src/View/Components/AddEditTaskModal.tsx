import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useOrientation } from '../../Utils/useOrientation';

const AddEditTaskModal = ({ visible, onClose, onSave, task }: any) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const { wp, hp, figmaH, figmaW } = useOrientation();
  const s = modalStyles(wp, hp, figmaW, figmaH);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setNotes(task.notes || '');
    } else {
      setTitle('');
      setNotes('');
    }
  }, [task]);

  const handleClose = () => {
    setTitle('');
    setNotes('');
    onClose && onClose();
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave && onSave({ title: title.trim(), notes: notes.trim() });
      setTitle('');
      setNotes('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <Text style={s.heading}>{task ? 'Edit Task' : 'Add Task'}</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            style={s.input}
          />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            style={[s.input, s.textarea]}
            multiline
          />
          <View style={s.row}>
            <Pressable onPress={handleClose} style={s.btn}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={s.btn}>
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = (
  wp: (v: number) => number,
  hp: (v: number) => number,
  figmaW: (v: number) => number,
  figmaH: (v: number) => number,
) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: '#fff',
      padding: figmaW(16),
      borderTopLeftRadius: figmaW(12),
      borderTopRightRadius: figmaW(12),
    },
    heading: {
      fontSize: figmaW(18),
      fontWeight: '700' as any,
      marginBottom: figmaH(8),
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: figmaW(6),
      padding: figmaW(10),
      marginBottom: figmaH(8),
    },
    textarea: {
      height: figmaH(80),
    },
    row: { flexDirection: 'row', justifyContent: 'flex-end' },
    btn: { padding: figmaW(10), marginLeft: figmaW(8) },
  });

export default AddEditTaskModal;
