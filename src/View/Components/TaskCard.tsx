import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../../Model/TaskModel/taskSlice';
import { useOrientation } from '../../Utils/useOrientation';

const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onRetry,
  isSyncing,
  onMeasure,
  onLocalReminder,
  onSendPush,
}: {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
  isSyncing?: boolean;
  onMeasure?: (id: string, height: number) => void;
  onLocalReminder?: (task: Task) => void;
  onSendPush?: (task: Task) => void;
}) => {
  const { wp, hp, figmaH, figmaW } = useOrientation();
  const s = styles(wp, hp, figmaW, figmaH);

  return (
    <View
      style={s.card}
      onLayout={e => {
        try {
          const h = Math.round(e.nativeEvent.layout.height);
          onMeasure && onMeasure(task.id, h);
        } catch (err) {}
      }}
    >
      <View style={s.row}>
        <Pressable
          onPress={() => onToggle(task.id, !task.completed)}
          style={s.checkbox}
        >
          <Text>{task.completed ? '✓' : ''}</Text>
        </Pressable>

        <View style={s.content}>
          <Text style={[s.title, task.completed && s.completed]}>
            {task.title}
          </Text>
          {task.notes ? <Text style={s.notes}>{task.notes}</Text> : null}
          <Text style={s.statusText}>
            {task.completed ? 'Completed' : 'Incomplete'}
          </Text>
        </View>

        <Pressable
          style={s.syncWrap}
          onPress={() => onRetry && onRetry(task.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[s.syncText, task.syncStatus !== 'synced' && s.pending]}>
            {task.syncStatus === 'synced'
              ? 'remote data'
              : task.syncStatus === 'deleted'
              ? 'DEL'
              : '…'}
          </Text>
          {task.syncStatus === 'pending' && (
            <Text style={s.localMark}>local</Text>
          )}
        </Pressable>

        <View style={s.actions}>
          <Pressable onPress={() => onEdit(task)} style={s.actionBtn}>
            <Text>Edit</Text>
          </Pressable>
          <Pressable onPress={() => onDelete(task.id)} style={s.actionBtn}>
            <Text>Delete</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable
          onPress={() => (onLocalReminder ? onLocalReminder(task) : null)}
          style={s.actionBtn}
        >
          <Text> Remind</Text>
        </Pressable>
        <Pressable
          onPress={() => (onSendPush ? onSendPush(task) : null)}
          style={s.actionBtn}
        >
          <Text>Push noti</Text>
        </Pressable>
      </View>
    </View>
  );
};

export function getItemHeight(figmaH: (v: number) => number) {
  return Math.round(figmaH(72));
}

const styles = (
  wp: (v: number) => number,
  hp: (v: number) => number,
  figmaW: (v: number) => number,
  figmaH: (v: number) => number,
) =>
  StyleSheet.create({
    card: {
      padding: figmaW(12),
      backgroundColor: '#fff',
      marginVertical: figmaH(6),
      marginHorizontal: figmaW(12),
      borderRadius: figmaW(8),
      elevation: 1,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    checkbox: {
      width: figmaW(28),
      height: figmaH(28),
      borderRadius: figmaW(6),
      borderWidth: 1,
      borderColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: figmaW(12),
    },
    content: { flex: 1 },
    title: { fontSize: figmaW(16), fontWeight: '600' as any },
    notes: { fontSize: figmaW(13), color: '#666' },
    completed: { textDecorationLine: 'line-through', color: '#999' },
    actions: { flexDirection: 'row' },
    actionBtn: { padding: figmaW(6), marginLeft: figmaW(6) },
    syncWrap: {
      width: figmaW(56),
      alignItems: 'center',
      justifyContent: 'center',
    },
    syncText: { fontSize: figmaW(12), color: '#4A4A4A' },
    pending: { color: '#FFA600' },
    localMark: { fontSize: figmaW(10), color: '#999' },
    statusText: { fontSize: figmaW(12), color: '#333', marginTop: figmaH(6) },
  });

export default React.memo(TaskCard);
